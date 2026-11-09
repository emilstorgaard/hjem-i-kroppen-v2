import { isTherapySlug } from '$lib/therapies';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => isTherapySlug(param);
