import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/src/components/ui/button";
import PurchaseButton from "@/src/components/PurchaseButton";

const page = async () => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const courses = await convex.query(api.courses.getCourses);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="flex flex-col overflow-hidden">
            {/* Image */}
            <Link href={`/courses/${course._id}`} className="cursor-pointer">
              <CardHeader className="p-0">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={640}
                  height={360}
                  className="rounded-t-md object-cover w-full h-48"
                />
              </CardHeader>
            </Link>

            {/* Title */}
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-lg font-semibold hover:underline">
                {course.title}
              </CardTitle>
            </CardContent>

            {/* Footer: Price + Button/Badge */}
            <CardFooter className="flex justify-between items-center border-t p-4">
              <span className="text-md font-semibold">${course.price.toFixed(2)}</span>

              <SignedIn>
                <PurchaseButton courseId={course._id} />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    Enroll Now
                  </Button>
                </SignInButton>
              </SignedOut>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default page;
