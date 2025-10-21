import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";
import { Login } from "@/components/Login";

type LoginSearchParams = {
  from?: string;
  [k: string]: string | string[] | undefined;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  const sp = await searchParams;
  const initialFrom = typeof sp.from === "string" ? sp.from : undefined;

  return (
    <div className="w-full h-svh flex bg-muted">
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-0">
        <Login initialFrom={initialFrom} />
      </div>

      <div className="lg:w-1/2 lg:relative lg:block hidden">
        <Image
          src="/bgLogin.webp"
          alt={SITE_NAME}
          fill
          className="object-cover"
          sizes="100svh"
        />
      </div>
    </div>
  );
}
