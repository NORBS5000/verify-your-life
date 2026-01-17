// Update this page (the content is just a fallback if you fail to update the page)

import SecurityFooter from "@/components/SecurityFooter";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
          <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        </div>
      </div>

      <SecurityFooter />
    </div>
  );
};

export default Index;
