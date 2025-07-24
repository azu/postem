// LICENSE : MIT
if (process.env.NODE_ENV === "development") {
    await import("@babel/register");
}
await import("./App.js");
const profile = await import("../share/profile.js");
profile.stop();
