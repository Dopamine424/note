


"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllDocuments, Document } from "@/firebase/config";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import { PartialBlock } from "@blocknote/core";
import { ElementRef } from "react";

interface GraphPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setGraphPanelWidth: (width: number) => void;
}

export const GraphPanel = ({ isOpen, setIsOpen, setGraphPanelWidth }: GraphPanelProps) => {
  const params = useParams();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<ElementRef<"aside">>(null);
  const isResizingRef = useRef(false);
  const [panelWidth, setPanelWidth] = useState(256);

  useEffect(() => {
    console.log("GraphPanel: Mounted, isOpen:", isOpen);
    return () => {
      console.log("GraphPanel: Unmounted");
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("GraphPanel: Subscribing to documents");
    setIsLoading(true);
    const unsubscribe = getAllDocuments((docs) => {
      console.log("GraphPanel: Received documents", {
        count: docs.length,
        docs: docs.map((d) => ({
          _id: d._id,
          title: d.title,
          hasContent: !!d.content,
          contentLength: d.content?.length || 0,
          parentDocument: d.parentDocument,
        })),
      });
      setDocuments(docs);
      setIsLoading(false);
    });
    return () => {
      console.log("GraphPanel: Unsubscribing from documents");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !documents.length || !params.documentId) {
      console.log("GraphPanel: Skipping render", { isOpen, hasContainer: !!containerRef.current, hasDocuments: documents.length, hasDocumentId: !!params.documentId });
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
      return;
    }

    console.log("GraphPanel: Rendering graph, documents:", documents.length);

    const elements: ElementDefinition[] = [];
    const links: { source: string; target: string }[] = [];
    const relatedDocIds = new Set<string>();

    const activeDoc = documents.find((doc) => doc._id === params.documentId);
    if (!activeDoc) {
      console.log("GraphPanel: Active document not found");
      return;
    }

    relatedDocIds.add(activeDoc._id);
    elements.push({
      data: {
        id: activeDoc._id,
        label: activeDoc.icon ? `${activeDoc.icon} ${activeDoc.title}` : activeDoc.title,
      },
    });

    documents.forEach((doc) => {
      if (doc.content) {
        try {
          const blocks = JSON.parse(doc.content) as PartialBlock[];
          blocks.forEach((block: PartialBlock, index: number) => {
            if (block.content && Array.isArray(block.content)) {
              const text = block.content
                .filter((inline: any) => inline.type === "text")
                .map((inline: any) => inline.text)
                .join("");
              console.log(`GraphPanel: Block ${index} text for doc ${doc._id}`, { text, parentDocument: doc.parentDocument });
              const regex = /\[\[([^\]]+)\]\]/g;
              let match;
              while ((match = regex.exec(text)) !== null) {
                const targetTitle = match[1].trim().toLowerCase();
                const targetDoc = documents.find(
                  (d) => d.title.toLowerCase() === targetTitle
                );
                if (targetDoc) {
                  if (doc._id === activeDoc._id && targetDoc._id !== doc._id) {
                    links.push({ source: doc._id, target: targetDoc._id });
                    relatedDocIds.add(targetDoc._id);
                    console.log("GraphPanel: Found outgoing link", {
                      source: doc.title,
                      target: targetDoc.title,
                      sourceParent: doc.parentDocument,
                    });
                  }
                  if (targetDoc._id === activeDoc._id && doc._id !== activeDoc._id) {
                    links.push({ source: doc._id, target: activeDoc._id });
                    relatedDocIds.add(doc._id);
                    console.log("GraphPanel: Found incoming link", {
                      source: doc.title,
                      target: targetDoc.title,
                      sourceParent: doc.parentDocument,
                    });
                  }
                }
              }
            }
          });
        } catch (error) {
          console.error(`GraphPanel: Error parsing content for doc ${doc._id}`, error);
        }
      }
    });

    documents.forEach((doc) => {
      if (relatedDocIds.has(doc._id) && doc._id !== activeDoc._id) {
        elements.push({
          data: {
            id: doc._id,
            label: doc.icon ? `${doc.icon} ${doc.title}` : doc.title,
          },
        });
      }
    });

    links.forEach((link, index) => {
      if (relatedDocIds.has(link.source) && relatedDocIds.has(link.target)) {
        elements.push({
          data: {
            id: `edge-${index}`,
            source: link.source,
            target: link.target,
          },
        });
      }
    });

    console.log("GraphPanel: Elements", elements);
    console.log("GraphPanel: Links", links);

    if (!elements.length) {
      console.log("GraphPanel: No elements to render");
      return;
    }

    try {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#d1d5db",
              width: 20,
              height: 20,
              label: "data(label)",
              color: "#333",
              "text-valign": "bottom",
              "text-halign": "center",
              "font-size": 10,
              "text-wrap": "wrap",
              "text-max-width": "100px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 1,
              "line-color": "#9ca3af",
              "curve-style": "bezier",
            },
          },
          {
            selector: `node[id = "${params.documentId}"]`,
            style: {
              "background-color": "#000000",
              width: 24,
              height: 24,
            },
          },
        ],
        layout: {
          name: "cose",
          animate: false,
          idealEdgeLength: () => 100,
          nodeOverlap: 20,
        },
        zoomingEnabled: true,
        userZoomingEnabled: true,
        minZoom: 0.5,
        maxZoom: 3,
      });

      console.log("GraphPanel: Cytoscape initialized");

      cyRef.current.on("tap", "node", (event) => {
        const nodeId = event.target.id();
        console.log("GraphPanel: Node clicked", nodeId);
        router.push(`/documents/${nodeId}`);
      });
    } catch (error) {
      console.error("GraphPanel: Cytoscape initialization failed", error);
    }

    return () => {
      console.log("GraphPanel: Destroying Cytoscape");
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [isOpen, documents, params.documentId, router]);

  const toggleGraph = () => {
    console.log("GraphPanel: toggleGraph", !isOpen);
    setIsOpen(!isOpen);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current || !panelRef.current) return;

    const newWidth = window.innerWidth - event.clientX;
    if (newWidth < 240) {
      setPanelWidth(240);
      setGraphPanelWidth(240);
      panelRef.current.style.width = `240px`;
      return;
    }
    if (newWidth > 480) {
      setPanelWidth(480);
      setGraphPanelWidth(480);
      panelRef.current.style.width = `480px`;
      return;
    }

    setPanelWidth(newWidth);
    setGraphPanelWidth(newWidth);
    panelRef.current.style.width = `${newWidth}px`;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <aside
      ref={panelRef}
      className={cn(
        "fixed top-0 right-0 h-full bg-gray-100 dark:bg-gray-800 overflow-y-auto flex flex-col z-[1000] border-l border-gray-300 dark:border-gray-700",
        isOpen ? "" : "w-0",
        "transition-all ease-in-out duration-300"
      )}
      style={{ width: isOpen ? `${panelWidth}px` : "0px" }}
    >
      <div className="flex justify-between items-center p-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Graph Panel
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleGraph}
          className="h-6 w-6"
        >
          <ChevronsRight
            className={cn("h-6 w-6", isOpen && "rotate-180")}
          />
        </Button>
      </div>
      {isOpen && (
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Загрузка...
            </div>
          ) : documents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Нет документов
            </div>
          ) : (
            <div
              ref={containerRef}
              className="flex-1 bg-white dark:bg-gray-900"
              style={{ minHeight: "400px", width: "100%" }}
            />
          )}
        </div>
      )}
      <div
        onMouseDown={handleMouseDown}
        className="opacity-0 hover:opacity-100 transition-colors cursor-ew-resize absolute h-full w-2 bg-gray-400/50 left-0 top-0"
      />
    </aside>
  );
};