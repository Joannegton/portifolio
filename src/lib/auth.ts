import { importSPKI, jwtVerify, type JWTPayload } from "jose"

let cachedPublicKey: Awaited<ReturnType<typeof importSPKI>> | null = null

async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey
  const pem = process.env.AUTH_PUBLIC_KEY
  if (!pem) throw new Error("AUTH_PUBLIC_KEY not configured")
  cachedPublicKey = await importSPKI(pem.replace(/\\n/g, "\n"), "RS256")
  return cachedPublicKey
}

export async function verifyJwt(token: string): Promise<JWTPayload> {
  const publicKey = await getPublicKey()
  const { payload } = await jwtVerify(token, publicKey, { algorithms: ["RS256"] })
  return payload
}
