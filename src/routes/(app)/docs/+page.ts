import { redirect } from '@sveltejs/kit'

export const load = () => {
	return redirect(300, '/docs/dev-env')
}
