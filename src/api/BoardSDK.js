export class ResponsesBoard {
  item() {
    return {
      create: (data) => {
        return {
          execute: async () => {
            console.log("Mock SDK Saving Payload:", data);
            // Simulating API network lag
            await new Promise((resolve) => setTimeout(resolve, 800));
            return { success: true };
          }
        };
      }
    };
  }
}
