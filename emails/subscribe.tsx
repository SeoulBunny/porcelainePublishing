import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

export default function SubscribeConfirm({ name }: { name?: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Georgia, serif", background: "#faf9f6", padding: "32px" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Heading as="h1" style={{ fontSize: "20px" }}>You’re on the list</Heading>
          <Text>{name ? `Thank you, ${name}. ` : ""}We’ll let you know when new editions and books are published by Porcelaine.</Text>
        </Container>
      </Body>
    </Html>
  );
}
