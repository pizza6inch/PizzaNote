"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The number is rendered at build time (server snapshot) and replaced by the live value on the client,
 * so a statically generated page never shows a stale count.
 */
export default function DaysAlive({
  launchDate,
  initial,
  template,
}: {
  launchDate: string;
  initial: number;
  template: string;
}) {
  const days = useSyncExternalStore(
    subscribe,
    () => Math.round(Math.abs(Date.now() - new Date(launchDate).getTime()) / 86_400_000),
    () => initial,
  );

  return <span>{template.replace("{days}", String(days))}</span>;
}
