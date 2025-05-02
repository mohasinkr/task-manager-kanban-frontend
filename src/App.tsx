import { useEffect, useState } from "react";
import { KanbanBoard } from "./components/KanbanBoard";
import { initMocks } from "./mocks";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mockStatus, setMockStatus] = useState<{
    initialized: boolean;
    enabled: boolean;
  }>({
    initialized: false,
    enabled: false,
  });

  // Initializing mock service worker
  useEffect(() => {
    const setupMocks = async () => {
      try {
        const mocksEnabled = await initMocks();

        setMockStatus({
          initialized: true,
          enabled: !!mocksEnabled,
        });
      } catch (error) {
        console.error("Failed to initialize mocks:", error);
        setMockStatus({
          initialized: true,
          enabled: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupMocks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Optional: Show a banner when mocks are enabled */}
      {mockStatus.enabled && (
        <div className="bg-primary/10 text-primary text-center py-1 text-sm">
          Running with mock API{" "}
          {import.meta.env.PROD ? "(production mode)" : "(development mode)"}
        </div>
      )}
      <KanbanBoard />
    </div>
  );
}

export default App;
