import type { MLAnalysisResult } from "@/types";

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  // @ts-expect-error - match() can return null, but we know the pattern exists in dataURL
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const getMLBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

export async function testServerConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  const base = getMLBaseURL();
  try {
    const res = await fetch(`${base}/health`, {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        message: data.message || "Server terhubung",
      };
    }
    return {
      connected: false,
      message: `Server merespons dengan status ${res.status}`,
    };
  } catch {
    return {
      connected: false,
      message: `Tidak dapat terhubung ke server di ${base}`,
    };
  }
}

export async function analyzeImage(file: File): Promise<MLAnalysisResult> {
  const base = getMLBaseURL();
  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch(`${base}/analyze`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ detail: res.statusText }));
      throw new Error(
        errorData.detail ||
          `Gagal terhubung ke server ML (Status: ${res.status})`
      );
    }

    const data = await res.json();
    return data as MLAnalysisResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("fetch") ||
      errorMessage.includes("Failed to fetch") ||
      error instanceof TypeError ||
      errorMessage.includes("NetworkError")
    ) {
      throw new Error(
        `Tidak dapat terhubung ke server ML di ${base}. Pastikan server berjalan dengan perintah: uvicorn main:app --reload --host 127.0.0.1 --port 8000`
      );
    }
    throw error;
  }
}
