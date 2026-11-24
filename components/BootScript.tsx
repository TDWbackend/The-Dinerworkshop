// A small script that must run before the page paints (it only sets classes on <html>).
export function BootScript({ code }: { code: string }) {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
