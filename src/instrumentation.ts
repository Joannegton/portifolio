export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { AppDataSource } = await import("@/lib/data-source")
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      await AppDataSource.runMigrations()
    }
  }
}
