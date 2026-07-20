interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{
      userId: string;
      favorites: string[];
      visited: string[];
    }>();

    if (!body.userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const { userId, favorites, visited } = body;

    await context.env.DB.prepare(
      `INSERT INTO UserData (userId, favorites, visited)
       VALUES (?1, ?2, ?3)
       ON CONFLICT (userId) DO UPDATE SET
       favorites = excluded.favorites,
       visited = excluded.visited`
    )
      .bind(userId, JSON.stringify(favorites), JSON.stringify(visited))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const result = await context.env.DB.prepare(
      "SELECT favorites, visited FROM UserData WHERE userId = ?"
    )
      .bind(userId)
      .first<{ favorites: string; visited: string }>();

    if (!result) {
      return new Response(JSON.stringify({ favorites: [], visited: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        favorites: JSON.parse(result.favorites || "[]"),
        visited: JSON.parse(result.visited || "[]"),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
