import { redirect } from 'next/navigation';

export default async function RedirectToUnifiedRegister({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/register?event=${slug}`);
}
