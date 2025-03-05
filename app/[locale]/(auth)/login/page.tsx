import { SubmitButton } from './submit-button';
import { signIn, signUp } from './actions';

export default function Login() {
	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col w-full px-8 sm:max-w-md gap-2">
				<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
					<label className="text-md" htmlFor="email">
						Email
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						placeholder="you@example.com"
						required
					/>
					<label className="text-md" htmlFor="password">
						Password
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						type="password"
						name="password"
						placeholder="••••••••"
						required
					/>
					<SubmitButton
						formAction={signIn}
						className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
						pendingText="Signing In..."
					>
						Sign In
					</SubmitButton>
					<SubmitButton
						formAction={signUp}
						className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
						pendingText="Signing Up..."
					>
						Sign Up
					</SubmitButton>
				</form>
			</div>
		</div>
	);
}
