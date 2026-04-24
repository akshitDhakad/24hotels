import { Star } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type HotelsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const mockResults = Array.from({ length: 8 }).map((_, i) => ({
  id: `h_${i + 1}`,
  name: ["Azure Horizon Estate", "Montroux Majesty Hotel", "Opulent Heights"][i % 3],
  city: ["Santorini, Greece", "Los Angeles, USA", "Dubai, UAE"][i % 3],
  price: [1200, 650, 980][i % 3],
  rating: [4.92, 4.7, 4.83][i % 3],
  image: [
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  ][i % 3],
}));

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const sp = (await searchParams) ?? {};
  const destination =
    typeof sp.destination === "string" ? sp.destination : "";

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-80">
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="text-sm font-semibold">Filters</div>
            <Separator className="my-4" />

            <div className="grid gap-4">
              <div>
                <div className="mb-2 text-sm font-medium">Destination</div>
                <Input defaultValue={destination} placeholder="Search city..." />
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Price range</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" inputMode="numeric" />
                  <Input placeholder="Max" inputMode="numeric" />
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Rating</div>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3].map((r) => (
                    <Button key={r} variant="outline" className="h-9">
                      {r}+ <Star className="ml-1 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {["Pool", "Wi‑Fi", "Breakfast", "Parking"].map((a) => (
                    <Badge key={a} className="cursor-pointer">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="h-11 rounded-xl">Apply</Button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-muted-foreground">
                Results
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {destination ? `Stays in ${destination}` : "All stays"}
              </h1>
            </div>
            <Button variant="outline">Sort</Button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {mockResults.map((h) => (
              <Card key={h.id} className="overflow-hidden">
                <div className="relative h-44 bg-muted">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {h.name}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {h.city}
                      </div>
                    </div>
                    <Badge className="gap-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {h.rating.toFixed(2)}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="text-sm font-semibold">
                      ${h.price.toLocaleString()} / night
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

