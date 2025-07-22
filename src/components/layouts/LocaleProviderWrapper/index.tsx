// Server component — được phép async
import { getMessages } from "next-intl/server";
import Providers from "@/components/layouts/Providers";

export default async function LocaleProviderWrapper({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getMessages(locale);

  return (
    <Providers locale={locale} messages={messages}>
      {children}
    </Providers>
  );
}
