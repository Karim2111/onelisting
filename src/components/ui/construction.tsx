import { Construction, Mail } from "lucide-react"
import { Shell } from "../shells/shell"

export default function UnderConstruction() {
  return (
    <Shell variant="centered">
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Crosslisting for Canadians
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Under Development
                </p>
              </div>
              <a
                href="mailto:supreqm@gmail.com"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-muted-foreground h-10 px-4 py-2"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact us at supreqm@gmail.com
              </a>
              <div className="mt-6">
                <Construction className="h-12 w-12 mx-auto text-gray-400" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Supreqm Inc. All rights reserved.
        </p>
      </footer>
    </div>
    </Shell>
  )
}