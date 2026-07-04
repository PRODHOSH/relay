"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function TourProvider() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run once on first login
    const hasSeenTour = localStorage.getItem("relay_tour_seen");
    if (hasSeenTour) return;

    // We only want to start the tour when they land on the dashboard root
    if (pathname !== "/dashboard") return;

    let tour: any;

    const navigateToNext = (path: string, nextSelector: string) => {
      router.push(path);
      let attempts = 0;
      const interval = setInterval(() => {
        if (document.querySelector(nextSelector)) {
          clearInterval(interval);
          tour.moveNext();
        }
        attempts++;
        if (attempts > 20) clearInterval(interval); // Timeout after 2s
      }, 100);
    };

    tour = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      overlayOpacity: 0.8,
      popoverClass: "brutalist-tour-popover",
      steps: [
        {
          element: '#dashboard-overview',
          popover: {
            title: 'Welcome to Relay!',
            description: 'This is your dashboard where you can see an overview of your queued emails and system status.',
            side: "bottom", align: 'start',
            onNextClick: () => navigateToNext('/dashboard/templates', '#templates-header')
          }
        },
        {
          element: '#templates-header',
          popover: {
            title: 'Template Manager',
            description: 'Create completely custom HTML or Markdown templates for your emails right here.',
            side: "bottom", align: 'start',
            onNextClick: () => navigateToNext('/dashboard/send', '#send-engine-box')
          }
        },
        {
          element: '#send-engine-box',
          popover: {
            title: 'Send Engine',
            description: 'Choose a template, paste in your recipient emails, and Relay will queue and batch send them safely without timeouts.',
            side: "top", align: 'start',
            onNextClick: () => navigateToNext('/dashboard/settings', '#settings-provider-box')
          }
        },
        {
          element: '#settings-provider-box',
          popover: {
            title: 'Configure Your Engine',
            description: 'Finally, set up your Google App Password or Resend API key here. Your engine needs fuel to send!',
            side: "top", align: 'start'
          }
        }
      ],
      onDestroyStarted: () => {
        if (!tour.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
          localStorage.setItem("relay_tour_seen", "true");
          tour.destroy();
        }
      },
    });

    // Start tour after a small delay to let UI render
    setTimeout(() => {
      tour.drive();
    }, 1000);

  }, [pathname, router]);

  return null;
}
