import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  heading: string;
  description: string;
  items?: FaqItem[];
  supportHeading: string;
  supportDescription: string;
  supportButtonText: string;
  supportButtonUrl: string;
}

const faqItems = [
  {
    id: "faq-1",
    question: "How do I watch movies and TV shows?",
    answer:
      "Simply browse our extensive library, select the title you want to watch, and click the play button. You can stream content directly in your browser.",
  },
  {
    id: "faq-2",
    question: "Is there a subscription fee?",
    answer:
      "No, our service is completely free to use. We provide access to a wide range of movies and TV shows without any subscription fees.",
  },
  {
    id: "faq-3",
    question: "What content is available?",
    answer:
      "We offer content from major studios including Marvel, DC, Star Wars, Warner Bros, Universal, Nickelodeon, and Pixar. Our library includes both movies and TV shows.",
  },
  {
    id: "faq-4",
    question: "Can I watch content offline?",
    answer:
      "Currently, our service is streaming-only. You need an internet connection to watch content on our platform.",
  },
  {
    id: "faq-5",
    question: "What devices are supported?",
    answer: "You can access our platform on any device with a modern web browser, including computers, tablets, and smartphones.",
  },
  {
    id: "faq-6",
    question: "Is the content available in HD?",
    answer:
      "Yes, most of our content is available in high definition (HD) quality. The actual quality may vary depending on your internet connection.",
  },
  {
    id: "faq-7",
    question: "Do you offer subtitles?",
    answer:
      "Yes, subtitles are available for most content in multiple languages. You can enable them through the player controls while watching.",
  },
];

const Faq = ({
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions about our streaming service. Can't find what you're looking for? Contact our support team.",
  items = faqItems,
  supportHeading = "Need help?",
  supportDescription = "Our support team is available 24/7 to help you with any questions or technical issues you may encounter.",
  supportButtonText = "Contact Support",
  supportButtonUrl = "#",
}: FaqProps) => {
  return (
    <section className="py-32">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-white/70 lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-white/10">
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60 text-white">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-white/70 lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl bg-white/5 backdrop-blur-sm p-4 text-center md:p-6 lg:p-8 border border-white/10">
          <div className="relative">
            <Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border md:mb-5">
              <AvatarImage src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="mb-4 size-16 border md:mb-5">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="mb-2 max-w-3xl font-semibold lg:text-lg text-white">
            {supportHeading}
          </h3>
          <p className="mb-8 max-w-3xl text-white/70 lg:text-lg">
            {supportDescription}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90" asChild>
              <a href={supportButtonUrl}>
                {supportButtonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Faq };