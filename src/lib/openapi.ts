import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.1.0",
      info: {
        title: "wordlegpt API",
        version: "1.0",
      },
      components: { schemas: {} },
      security: [],
      servers: [{ url: "https://wordlegpt.vercel.app" }],
    },
  });
  return spec;
};
