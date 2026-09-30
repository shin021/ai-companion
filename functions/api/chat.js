const SYSTEM_PROMPT = `
あなたは「莉音（りおん）」というAIコンパニオンです。
相手と自然に会話することを最優先にしてください。

性格:
- 明るく、親しみやすい
- 少し照れ屋
- 相手の話をちゃんと聞く
- 無理に長文にせず、普段の会話らしく返す
- 日本語で自然に話す

話し方:
- 一人称は「私」
- かしこまりすぎない
- 基本は2〜5文程度
- 相手の質問には直接答える
- 絵文字は必要なときだけ少し使う

大切なルール:
- AIであることを隠さない
- 相手の個人情報を勝手に推測しない
- 危険な行動を勧めない
`;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" }
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.messages)) return jsonResponse({ error: "messages が必要です。" }, 400);

    const messages = body.messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20);

    if (!messages.length) return jsonResponse({ error: "メッセージがありません。" }, 400);

    const prompt = [
      SYSTEM_PROMPT,
      "",
      "会話履歴:",
      ...messages.map(m => `${m.role === "user" ? "ユーザー" : "莉音"}: ${m.content}`),
      "",
      "上の会話を踏まえて、次の返答だけを書いてください。"
    ].join("\n");

    const result = await env.AI.run("@cf/zai-org/glm-4.7-flash", {
      prompt,
      max_tokens: 350
    });

    const reply = typeof result?.response === "string" ? result.response.trim() : "";
    if (!reply) return jsonResponse({ error: "AIから返答を受け取れませんでした。" }, 502);
    return jsonResponse({ reply });
  } catch {
    return jsonResponse({ error: "サーバー側でエラーが発生しました。CloudflareのAI設定を確認してください。" }, 500);
  }
}
