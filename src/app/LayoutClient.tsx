// src/app/LayoutClient.tsx

"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { NextIntlClientProvider } from "next-intl";

const LayoutClient = ({ children, locale, messages }: any) => {
  return (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <main>{children}</main>
      </NextIntlClientProvider>
    </Provider>
  );
};

export default LayoutClient;
