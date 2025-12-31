import PrivateLayout from "./(protected)/layout";

const page = () => {
  return (
    <div>
      <PrivateLayout>
        <div className="text-2xl font-medium text-bg-surface flex items-center justify-center h-screen">Hello world</div>
      </PrivateLayout>
    </div>
  );
};

export default page;
