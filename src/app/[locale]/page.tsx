import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Qafila</h1>
        <Image
          src="/Qafila-01.svg"
          alt="Qafila"
          width={200}
          height={80}
          className="mx-auto my-6"
        />
        <p className="text-muted-foreground mt-2">Coming Soon</p>
      </div>
    </div>
  );
}
