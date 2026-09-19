import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MembershipPromoModal from "@/components/MembershipPromoModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
      <MembershipPromoModal />
    </>
  );
}
