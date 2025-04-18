"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { LanguageLink } from "@/components/common/language-link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  bgColor?: string;
  iconColor?: string;
  buttonText?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-500",
  buttonText = "Get Started",
  className,
}: FeatureCardProps) {
  const iconBgClass = bgColor;
  const iconTextClass = iconColor;

  return (
    <Card className={cn("h-full hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            iconBgClass
          )}
        >
          <div className={cn("w-6 h-6", iconTextClass)}>{icon}</div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{/* Card content can be customized */}</CardContent>
      <CardFooter>
        <LanguageLink href={href} className="w-full">
          <Button variant="outline" className="w-full group">
            {buttonText}
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </LanguageLink>
      </CardFooter>
    </Card>
  );
}
