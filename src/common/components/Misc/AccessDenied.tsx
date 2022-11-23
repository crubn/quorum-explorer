import { Button, Center, Container, Heading, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView="visible"
        viewport={{ once: true }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Container mt={10}>
          <Center>
            <VStack gap={3}>
              <Heading as="h1" size="4xl" noOfLines={1}>
                Access Denied
              </Heading>
              <Link href="/api/auth/signin">
                You must be signed in to view this page.
              </Link>
              <Button
                colorScheme="brand"
                // href="/api/auth/signin"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </Button>
            </VStack>
          </Center>
        </Container>
      </motion.section>
    </>
  );
}
