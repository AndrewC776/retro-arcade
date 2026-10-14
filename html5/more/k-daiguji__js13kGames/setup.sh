if [ $(uname) = "Linux" ]; then
  echo "Installing mise..."
 	curl https://mise.run | sh
	echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
	echo "Installed mise"
elif [ $(uname) = "Darwin" ]; then
 	echo "Installing mise..."
 	curl https://mise.run | sh
	echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
	echo "Installed mise"
else
 	echo "Unsupported OS"
 	exit 1
fi

echo "Setting up pre-commit hook"
git config --local core.hooksPath .githooks
chmod +x .githooks/pre-commit
echo "Pre-commit hook setup complete"
