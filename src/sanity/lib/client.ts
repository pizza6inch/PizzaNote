import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // token,
  useCdn: true, // Set to true to use Cdn cache, the data will change depends on revalidate time
});

export const liveClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN, // Use token for read operations
  useCdn: false, // Set to false for read operations
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN, // Use token for write operations
  useCdn: false, // Set to false for write operations
});
