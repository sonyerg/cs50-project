import LibraryGrid from "@/components/LibraryGrid";
import LibraryHeader from "@/components/LibraryHeader";

interface HomePageProps {
  isAuth: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isAuth }) => (
  <div className="min-h-screen bg-gray-50 font-serif">
    <LibraryHeader isAuth={isAuth} />

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 ">
      <LibraryGrid />
    </main>

    <footer className="bg-white py-5 flex flex-col items-center justify-center space-y-2">
      <a href="https://github.com/sonyerg">
        Made by <code>@sonyerg</code> for CS50x 2025
      </a>
      <p className="text-sm">©2025 Digital Library</p>
    </footer>
  </div>
);

export default HomePage;
