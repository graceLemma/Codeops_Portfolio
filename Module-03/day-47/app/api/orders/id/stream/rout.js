// app/api/orders/[id]/stream/route.js
import { getStatus } from "@/lib/orders"; // Assume a helper to fetch current status

export async function GET(request, { params }) {
  const { id } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) =>
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);

      // Seed initial status immediately upon connection
      try {
        const initialStatus = await getStatus(id);
        send(initialStatus);
      } catch (err) {
        send({ error: "Unable to fetch initial status" });
      }

      // Optional: Polling interval or DB listener to push periodic updates
      const interval = setInterval(async () => {
        try {
          const updatedStatus = await getStatus(id);
          send(updatedStatus);
          
          // If delivered, stop the stream interval
          if (updatedStatus.state === "DELIVERED") {
            clearInterval(interval);
            controller.close();
          }
        } catch (e) {
          clearInterval(interval);
          controller.error(e);
        }
      }, 5000);

      // Cleanup when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}