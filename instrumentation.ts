import createPool from "@/app/lib/db/mysql";

export async function register() {
  await createPool();
}