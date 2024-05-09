import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';
import { partytownVite } from '@builder.io/partytown/utils';
import { join } from 'path';

export default defineConfig({
	plugins: [sveltekit(), partytownVite({
		dest: join(__dirname, 'static', '~partytown')
	}), svg({
		svgoOptions: {
			plugins: [{
				name: 'preset-default',
				params: {
					overrides: {
						removeTitle: false
					}
				}
			}]
		}
	})]
});
