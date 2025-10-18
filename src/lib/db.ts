import postgres from "postgres";

declare global {
  var _postgres: ReturnType<typeof postgres> | undefined;
}

const sql = (global._postgres ??= postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 60,
}));

export default sql;
