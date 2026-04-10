## Error Type
Recoverable Error

## Error Message
Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <ScrollAndFocusHandler segmentPath={[...]}>
      <InnerScrollAndFocusHandler segmentPath={[...]} focusAndScrollRef={{apply:false, ...}}>
        <ErrorBoundary errorComponent={function DashboardError} errorStyles={<SegmentViewNode>} errorScripts={[...]}>
          <ErrorBoundaryHandler pathname="/dashboard" errorComponent={function DashboardError} ...>
            <LoadingBoundary name="dashboard/" loading={[...]}>
              <Suspense name="dashboard/" fallback={<Fragment>}>
                <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
                  <RedirectBoundary>
                    <RedirectErrorBoundary router={{...}}>
                      <InnerLayoutRouter url="/dashboard" tree={[...]} params={{}} cacheNode={{rsc:<Fragment>, ...}} ...>
                        <SegmentViewNode type="page" pagePath="/5stelle/s...">
                          <SegmentTrieNode>
                          <DashboardPage>
                            <div className="max-w-6xl ...">
                              <div>
                              <QuickStartChecklist>
                              <div
+                               className="grid gap-4 grid-cols-1 md:grid-cols-3"
-                               className={null}
                              >
                                <Card>
                                  <div
                                    data-slot="card"
+                                   className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6..."
-                                   className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-..."
                                  >
                                    <CardHeader>
                                      <div
                                        data-slot="card-header"
+                                       className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] ite..."
-                                       className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] ite..."
                                      >
                                        <div className="flex items...">
                                          <CardTitle>
                                            <div
                                              data-slot="card-title"
+                                             className="text-sm font-medium text-muted-foreground"
-                                             className="font-semibold text-lg"
                                            >
+                                             Soddisfazione complessiva
-                                             Inizia qui
                                          ...
                                    ...
                                ...
                              ...
                        ...
                      ...
        ...



    at throwOnHydrationMismatch (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:3348:56)
    at prepareToHydrateHostInstance (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:3402:23)
    at completeWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:6934:60)
    at runWithFiberInDEV (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:965:74)
    at completeUnitOfWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9627:23)
    at performUnitOfWork (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9564:28)
    at workLoopConcurrentByScheduler (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9558:58)
    at renderRootConcurrent (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9541:71)
    at performWorkOnRoot (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:9068:150)
    at performWorkOnRootViaSchedulerTask (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_react-dom_4efc21ed._.js:10230:9)
    at MessagePort.performWorkUntilDeadline (file:///Users/filippoaggio/Filippo/Web Dev/5stelle/.next/dev/static/chunks/d664f_next_dist_compiled_3cedf71e._.js:2647:64)
    at div (<anonymous>:null:null)
    at CardTitle (about://React/Server/file:///Users/filippoaggio/Filippo/Web%20Dev/5stelle/.next/dev/server/chunks/ssr/5stelle_src_ca2523ec._.js?141:48:274)
    at DashboardPage (about://React/Server/file:///Users/filippoaggio/Filippo/Web%20Dev/5stelle/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__dcfa8142._.js?116:504:303)

Next.js version: 16.1.6 (Turbopack)
