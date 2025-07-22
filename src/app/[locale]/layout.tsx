import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LayoutClient from "@/app/LayoutClient";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { children } = props;
  const { locale } = await Promise.resolve(props.params); // ✅ bắt buộc await

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <LayoutClient locale={locale} messages={messages}>
      {children}
    </LayoutClient>
  );
}
