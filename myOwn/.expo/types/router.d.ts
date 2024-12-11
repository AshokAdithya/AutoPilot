/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/EmailMess` | `/EmailMess`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Youtube` | `/Youtube`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/EmailMess` | `/EmailMess`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Youtube` | `/Youtube`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/EmailMess${`?${string}` | `#${string}` | ''}` | `/EmailMess${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Youtube${`?${string}` | `#${string}` | ''}` | `/Youtube${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/EmailMess` | `/EmailMess`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Youtube` | `/Youtube`; params?: Router.UnknownInputParams; };
    }
  }
}
