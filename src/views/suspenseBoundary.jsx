// suspenseBoundary.jsx
import { Suspense } from "react";
import LoadingView from "./loadingView";

export default function SuspenseBoundary({ children, message = "Loading..." }) {
  return (
    <Suspense fallback={<LoadingView message={message} />}>
      {children}
    </Suspense>
  );
}
