import { Html, Head, Body, Container, Heading, Text, Button } from "@react-email/components";

export default function VerifyEmail({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Georgia, serif", background: "#faf9f6", padding: "32px" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Heading as="h1" style={{ fontSize: "20px" }}>Confirm your email</Heading>
          <Text>Confirm your email address to finish setting up your Porcelaine contributor account.</Text>
          <Button href={url} style={{ background: "#1a1a1a", color: "#fff", padding: "12px 20px", textDecoration: "none" }}>
            Verify email
          </Button>
          <Text style={{ fontSize: "12px", color: "#777" }}>If you didn’t create an account, ignore this message.</Text>
        </Container>
      </Body>
    </Html>
  );
}
