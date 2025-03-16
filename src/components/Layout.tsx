import { Outlet, useLocation, useNavigate } from "react-router";
import { useDarkModeStore } from "../stores/useDarkModeStore";
import {
  LocalizationState,
  useLocalizationStore,
} from "../stores/useLocalizationStore";
import { translations } from "../configs/translations";

const availableLanguages = [
  {
    image: "Germany.png",
    code: "ge",
  },
  {
    image: "USA.png",
    code: "en",
  },
];

const buttonLinks = [
  {
    text: "Submit",
    href: "/submit",
  },
  {
    text: "List",
    href: "/list",
  },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode = useDarkModeStore((state) => state.darkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);
  const language = useLocalizationStore((state) => state.language);
  const changeLanguage = useLocalizationStore((state) => state.changeLanguage);

  return (
    <div
      className={`${darkMode ? "bg-slate-600 text-white" : "bg-white text-black"} min-h-screen p-2 sm:p-10`}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm">{translations[language].darkMode}</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => toggleDarkMode()}
          />
        </div>

        <div className="flex flex-row items-center gap-2">
          {availableLanguages.map((i, index) => (
            <div
              key={index}
              className={`${language === i.code && "border-b-2 border-b-green-500 pb-2"} cursor-pointer`}
              onClick={() =>
                changeLanguage(i.code as LocalizationState["language"])
              }
            >
              <img src={`/${i.image}`} width={32} height={32} />
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-3xl mt-4 font-black">
        {translations[language].welcome}!
      </h1>
      <p>
        {
          translations[language]
            .please_choose_a_section_by_clicking_on_the_buttons_below
        }
        :
      </p>

      <div className="flex flex-row items-center justify-center gap-6 mt-4">
        {buttonLinks.map((i, index) => (
          <button
            key={index}
            className={`${location.pathname === i.href && "bg-blue-400 text-white"} w-sm bg-blue-200 text-black rounded-sm font-medium cursor-pointer py-3 px-6`}
            onClick={() => navigate(i.href)}
          >
            {translations[language][i.text.toLowerCase() as "submit" | "list"]}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
