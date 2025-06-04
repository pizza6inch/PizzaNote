import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // token,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token:process.env.SANITY_API_WRITE_TOKEN, // Use token for write operations
  useCdn: false, // Set to false for write operations
});