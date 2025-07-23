import { useTranslations } from "next-intl";

const Test = () => {
  const t_home = useTranslations("home");

  return (
    <div>
      <h1 className="p-4 border-4 border-red-500 bg-background-phs">
        Test Theme And Locale
      </h1>
      <h2 className="text-lg font-semibold">
        {t_home("homepage_btn_title")} / {t_home("logout_btn_title")}
      </h2>
    </div>
  );
};

export default Test;
