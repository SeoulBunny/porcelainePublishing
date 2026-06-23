import { Container, InkButton } from "@/app/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-tight text-ink">
        This page could not be found.
      </h1>
      <p className="mt-5 max-w-md text-body">
        The page you are looking for may have moved, or never existed.
      </p>
      <div className="mt-10">
        <InkButton href="/" variant="solid">
          Return home
        </InkButton>
      </div>
    </Container>
  );
}
