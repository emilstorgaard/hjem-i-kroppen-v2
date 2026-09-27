import type { SeoProperties } from './seo';
import type { ContactProperties } from './contact';
import type { HeroProperties } from './hero';

export type HomePageProperties = SeoProperties & ContactProperties & HeroProperties;

export type HomePage = {
	id: string;
	name: string;
	contentType: string;
	properties: HomePageProperties;
};
