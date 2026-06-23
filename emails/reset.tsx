import { Html, Head, Body, Container, Heading, Text, Button } from "@react-email/components";

export default function ResetPassword({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Georgia, serif", background: "#faf9f6", padding: "32px" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Heading as="h1" style={{ fontSize: "20px" }}>Reset your password</Heading>
          <Text>Use the button below to choose a new password. This link expires shortly.</Text>
          <Button href={url} style={{ background: "#1a1a1a", color: "#fff", padding: "12px 20px", textDecoration: "none" }}>
            Reset password
          </Button>
          <Text style={{ fontSize: "12px", color: "#777" }}>If you didn’t request this, ignore this message.</Text>
        </Container>
      </Body>
    </Html>
  );
}
