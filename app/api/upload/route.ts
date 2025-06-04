import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const storage = getStorage();
const auth = getAuth();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Токен не предоставлен" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не предоставлен" }, { status: 400 });
    }

    const fileRef = storage.bucket().file(`covers/${userId}/${file.name}`);

    await fileRef.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type, 
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-17-2500", 
    });

    return NextResponse.json({ url: downloadURL });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
    return NextResponse.json({ error: "Не удалось загрузить файл" }, { status: 500 });
  }
}