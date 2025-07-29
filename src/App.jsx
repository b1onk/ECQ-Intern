import TodoApp from './pages/TodoApp'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-yellow-300 transition-colors">
        <TodoApp />
      </div>
    </ThemeProvider>
  );
}

export default App;
