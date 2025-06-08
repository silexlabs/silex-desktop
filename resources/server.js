import NeutralinoApp from "node-neutralino"

console.log('xxxxxxxxxxxxxxx')
async function main() {
  const app = new NeutralinoApp({
    url: "/",
    windowOptions: {
      enableInspector: false,
    }
  });

  app.init();

  app.events.on("backend.maximize", () => {
    app.window.maximize();
  });
}

main();
