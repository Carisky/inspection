// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверяем секретный токен для безопасности.
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Неверный токен" });
  }

  console.log("Получен запрос на ревалидацию:", req.body);

  // Пытаемся получить paths из тела запроса
  let { paths } = req.body || {};

  // Если paths не передан, пробуем извлечь его из lastPreviewUrl, который находится в data.meta
  if (!paths) {
    const { newValue } = req.body;
    if (newValue && newValue.meta && newValue.meta.lastPreviewUrl) {
      try {
        const parsedUrl = new URL(newValue.meta.lastPreviewUrl);
        // Получаем только часть пути (pathname) без query string
        let pathname = parsedUrl.pathname || "/";
        pathname = pathname.trim() || "/";
        console.log("Извлечённый путь из lastPreviewUrl:", pathname);
        paths = [pathname];
      } catch (error) {
        console.error("Ошибка при парсинге lastPreviewUrl:", error);
        return res
          .status(400)
          .json({ message: "Невозможно извлечь путь из lastPreviewUrl" });
      }
    }
  }

  // Если paths передан как строка, преобразуем в массив, разделяя по запятой
  if (typeof paths === "string") {
    paths = paths
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res
      .status(400)
      .json({ message: "Не указаны пути для пересборки" });
  }

  console.log("Пути для пересборки:", paths);

  try {
    await Promise.all(
      paths.map(async (path: string) => {
        // Убедимся, что путь начинается со слеша
        if (!path.startsWith("/")) {
          path = "/" + path;
        }
        console.log(`Пересобираем: ${path}`);
        await res.revalidate(path);
      })
    );
    return res.json({ revalidated: true, paths });
  } catch (err) {
    console.error("Ошибка при пересборке:", err);
    return res
      .status(500)
      .json({ message: "Ошибка при пересборке", error: err });
  }
}
