import { Component, h, Prop, State } from '@stencil/core';

let fin = window['fin'];

@Component({
	tag: 'fin-context-group-picker',
	styleUrl: 'context-group-picker.css',
	shadow: true,
})
export class ContextGroupPicker {
	@State() showContextGroupList = false;
	@State() contextGroupId = undefined;

	iconColor = null;
	iconId = null;
	availableContextGroups:{ id: string; color: string }[] = [];
	showListId;

	/**
	 * Bind views on Context Selection. Only supported when the control is on a window with childViews
	 */
	@Prop() bindViews: boolean = true;

	/**
	 * Bind the window/view the control is place on when Context Selection is made
	 */
	@Prop() bindSelf: boolean = true;

	/**
	 * What should the no context group selected color be
	 */
	@Prop() unselectedColor: string = '#ffffff';

	/**
	 * What should the no context group selected line color be
 	*/
	@Prop() unselectedLineColor: string = '#000000';

	/**
	 * What should the delay be before switching to the list of context groups
	 */
	@Prop() listDelay: number = 500;

	/**
	 * Should the list of available options show when clicked or hovered?
	 */
	@Prop() showListOnClick: boolean = true;

	/**
	 * What should the tooltip show when no context group is selected
	 */
	@Prop() unselectedText: string =
		'No Context Group Selected' + (this.showListOnClick ? '. Click To Join.' : '');

	/**
	 * What should the tooltip show for the currently selected context group? Use {0} to represent where the group id should go
	 */
	@Prop() selectedText: string =
		'Current Context Is {0}' + (this.showListOnClick ? '. Click To Switch/Leave.' : '');

	/**
	 * What should the tooltip show for joining the context group? Use {0} to represent where the group id should go
	 */
	@Prop() joinText: string = 'Switch to {0} Context Group';

	/**
	 * What should the tooltip show for leaving the context group? Use {0} to represent where the group id should go
	 */
	@Prop() leaveText: string = 'Leave {0} Context Group';

	/**
	 * The DOM event this component should listen for to refresh the context group icon. 
	 * If the event is passed a contextGroupId in the detail then it will update the icon to that context group otherwise it will try and determine it.
	 * Only used when bindViews is true and bindSelf is false.
	 */
	@Prop() contextGroupRefreshEventId: string = 'refresh-context-group';

	/**
	 * Support setting context group by Querystring: ?contextGroupId=green
	 */
	@Prop() isQueryStringEnabled: boolean = false;

	/**
	 * Should the component monitor to see if the context group for the hosting page (if bind self is true) has been assigned to a context group outside of the context group picker. Useful for views that allow selection but can be set by the host. */
	@Prop() isMonitoringEnabled: boolean = false;

	async joinContextGroup(contextGroupId: string, viewIdentity?: any) {
		if (fin !== undefined) {
			let errorEncountered = false;
			if (this.bindViews === true && (fin.me.isWindow === true || fin.me.isBrowserEnvironment())) {
				if (viewIdentity === undefined) {
					let views = await this.getViews();
					for (let i = 0; i < views.length; i++) {
						try {
							await fin.me.interop.joinContextGroup(contextGroupId, views[i]);
						} catch {
							errorEncountered = true;
						}
					}
				} else {
					try {
						await fin.me.interop.joinContextGroup(contextGroupId, viewIdentity);
					} catch {
						errorEncountered = true;
					}
				}
			}
			if (this.bindSelf) {
				try {
					await fin.me.interop.joinContextGroup(contextGroupId, fin.me.identity);
				} catch {
					errorEncountered = true;
				}
			}
			if(errorEncountered) {
				console.warn("Error encountered when trying to join context group. This may be because one or more views or the window hosting the component is not connected to a broker.");
			}
		}
	}

	async leaveContextGroup(viewIdentity?: any) {
		if (fin !== undefined) {
			let errorEncountered = false;
			if (this.bindViews === true && (fin.me.isWindow === true || fin.me.isBrowserEnvironment())) {
				if (viewIdentity === undefined) {
					let views = await this.getViews();
					for (let i = 0; i < views.length; i++) {
						try {
							await fin.me.interop.removeFromContextGroup(views[i]);
						} catch {
							errorEncountered = true;
						}
					}
				} else {
					try {
						await fin.me.interop.removeFromContextGroup(viewIdentity);
					} catch {
						errorEncountered = true;
					}
				}
			}
			if (this.bindSelf) {
				try {
					await fin.me.interop.removeFromContextGroup(fin.me.identity);
				} catch {
					errorEncountered = true;
				}
			}
			if(errorEncountered) {
				console.warn("Error encountered when trying to leave context group. This may be because one or more views or the window hosting the component is not connected to a broker.");
			}
		}
	}

	async saveSelectedContextGroup(contextGroupId: string) {
		if (this.bindSelf === false && fin.me.updateOptions !== undefined) {
			// if we are not assigning the context group against ourselves but only childViews then it will not fall under interop within options. Save to a backup location.
			await fin.me.updateOptions({ customData: { selectedContextGroup: contextGroupId } });
		}
	}

	updateContextGroupIcon(contextGroupId?: string) {
		let selectedContextGroup = this.availableContextGroups.find(entry => entry.id === contextGroupId);
		if (selectedContextGroup === undefined) {
				this.contextGroupId = undefined;
				this.iconColor = this.unselectedColor;
				this.iconId = undefined;
		} else {
			this.iconColor = selectedContextGroup.color;
			this.iconId = selectedContextGroup.id;
			this.contextGroupId = contextGroupId;
		}
	}

	async updateContextGroup(contextGroupId: string, viewIdentity?: any, deselectOnMatch = true) {
		setTimeout(async ()=> {
			let selectedContextGroup = this.availableContextGroups.find(entry => entry.id === contextGroupId);

			if (selectedContextGroup !== null && selectedContextGroup !== undefined) {
				if (this.contextGroupId === contextGroupId && deselectOnMatch) {
					this.updateContextGroupIcon();
					await this.leaveContextGroup(viewIdentity);
				} else {
					let joinAllViews = this.contextGroupId === undefined;
					this.updateContextGroupIcon(contextGroupId);
					if (joinAllViews) {
						await this.joinContextGroup(contextGroupId);
					} else {
						await this.joinContextGroup(contextGroupId, viewIdentity);
					}
				}
	
				await this.saveSelectedContextGroup(this.contextGroupId);
				this.showContextGroupList = false;
			}
		}, 1000);
	}

	private async getTargetContextGroup(name?: string): Promise<string> {
		return new Promise((resolve) => {
			setTimeout(async () => {
				let targets: { name: string }[] = [];

				if(name !== undefined && this.bindSelf && !this.bindViews) {
					targets.push({ name });
				} else if(this.bindViews) {
					const views = await this.getViews();
					targets.push(...views);
				}
				if (targets.length > 0) {
					const groupCounts: { [key: string]: number } = {};

					for (let i = 0; i < this.availableContextGroups.length; i++) {
						const group = this.availableContextGroups[i];
						const contextGroupClients: { name: string }[] = await fin.me.interop.getAllClientsInContextGroup(group.id);

						// Initialize the count for this group
						groupCounts[group.id] = 0;

						// Count the number of views in this context group
						for (const target of targets) {
							if (contextGroupClients.some(client => client.name === target.name)) {
								groupCounts[group.id]++;
								if(targets.length === 1) {
									// if we are only checking one target and we have a match then we can break early
									break;
								}
							}
						}
					}

					// Find the context group with the maximum count
					let targetGroupId = this.contextGroupId;
					let maxCount = 0;

					for (const groupId in groupCounts) {
						if (groupCounts[groupId] > maxCount) {
							maxCount = groupCounts[groupId];
							targetGroupId = groupId;
						}
					}

					resolve(targetGroupId);
				} else {
					resolve(this.contextGroupId);
				}
			}, 1000);
		});
	}

	private showContextList() {
		if (this.showListId !== undefined) {
			clearTimeout(this.showListId);
		}
		this.showListId = setTimeout(() => {
			this.showContextGroupList = true;
			this.showListId = undefined;
		}, this.listDelay);
	}

	private hideContextList() {
		this.showContextGroupList = false;
	}

	private getContextGroupTooltip(contextGroupId: string, isSelected = false) {
		let displayContextGroupId = contextGroupId.charAt(0).toUpperCase() + contextGroupId.slice(1);

		if (isSelected) {
			return this.selectedText.replace('{0}', displayContextGroupId);
		}
		if (contextGroupId === this.contextGroupId) {
			return this.leaveText.replace('{0}', displayContextGroupId);
		}
		return this.joinText.replace('{0}', displayContextGroupId);
	}

	private async getCurrentContextGroup(): Promise<string> {
		return new Promise((resolve) => {
			setTimeout(async () => {
				let selectedContextGroup: string;
				if(fin.me.getOptions !== undefined) {
					let options = await fin.me.getOptions();

					if (options.interop !== undefined && options.interop.currentContextGroup !== undefined) {
						selectedContextGroup = options.interop.currentContextGroup;
					} else if (
						this.bindSelf === false &&
						options.customData !== undefined &&
						options.customData.selectedContextGroup !== undefined
					) {
						selectedContextGroup = options.customData.selectedContextGroup;
					}			
				} else if(window["fdc3"] !== undefined) {
					const currentContextGroup = await window["fdc3"].getCurrentChannel();
					selectedContextGroup = currentContextGroup.id;
				} else {
					// if we don't have access to any of the above options then go through context groups looking for a match for the current identity.
					selectedContextGroup = await this.getTargetContextGroup(fin.me.identity.name)
				}
				resolve(selectedContextGroup);
			}, 1000);
		});
	}

	private monitor() {
		setTimeout(async () => {
			let currentContextGroup: string | undefined;

			if(this.bindSelf) {
				currentContextGroup = await this.getCurrentContextGroup();
			} else if(this.bindViews) {
				currentContextGroup = await this.getTargetContextGroup();
			}

			if(currentContextGroup !== undefined) {
				this.updateContextGroupIcon(currentContextGroup);
			}
			this.monitor();
		}, 2000);
	}

	private async setupContextPicker() {
		if (fin !== undefined) {
			if (this.bindViews && fin.me.isWindow === true) {
				let win = await fin.Window.getCurrent();
				win.on('view-attached', async attachedView => {
					if (this.contextGroupId !== undefined) {
						await this.updateContextGroup(
							this.contextGroupId,
							attachedView.viewIdentity,
							false,
						);
					} else {
						let view = fin.View.wrapSync(attachedView.viewIdentity);
						let options = await view.getOptions();
						if (
							options.interop !== undefined &&
							options.interop.currentContextGroup !== undefined
						) {
							await this.updateContextGroup(
								options.interop.currentContextGroup,
								attachedView.viewIdentity,
							);
						}
					}
				});
			}

			let contextGroups = await fin.me.interop.getContextGroups();
			contextGroups.forEach(contextGroup => {
				this.availableContextGroups.push({
					id: contextGroup.id,
					color: contextGroup.displayMetadata.color,
				});
			});

			if (this.isQueryStringEnabled) {
				const urlParams = new URLSearchParams(window.location.search);
				const contextGroupId = urlParams.get('contextGroupId');
				if (contextGroupId !== undefined && contextGroupId !== null) {
					await this.updateContextGroup(contextGroupId);
				}
			}

			if (this.contextGroupId === undefined) {
					let selectedContextGroup: string = await this.getCurrentContextGroup();
					await this.updateContextGroup(selectedContextGroup);
			}

			if(this.isMonitoringEnabled) {
				// for now this is an interval check which works across all environments
				this.monitor();
			}

			if(this.bindViews && !this.bindSelf) {
					const majorityContextGroup = await this.getTargetContextGroup();
					if (this.contextGroupId !== majorityContextGroup) {
						await this.updateContextGroup(majorityContextGroup);
					}
					window.addEventListener(this.contextGroupRefreshEventId, async (event: CustomEvent) => {
							// the trigger may be a layout being created/removed and the view may not have been applied yet.
							if(event.detail !== null && event.detail !== undefined &&
								event.detail.contextGroupId !== null && 
								event.detail.contextGroupId !== undefined) {
								this.updateContextGroupIcon(event.detail.contextGroupId);
							} else {
								const majorityContextGroup = await this.getTargetContextGroup();
								this.updateContextGroupIcon(majorityContextGroup);
							}
					});
			}
		}
	}

	private async getViews() {
		let identities = [];
		try {
			if((fin.me.isWindow || fin.me.isBrowserEnvironment()) && this.bindViews) {
				let layout = fin.Platform.Layout.getCurrentSync();
				let views = await layout.getCurrentViews()
				identities = views.map(view => view.identity);
			} else if(this.bindSelf === true && this.bindViews === false) {
				console.warn("getViews shouldn't be called if bindViews is false and bindSelf is true.");
				identities.push(fin.me.identity);
			}
		} catch (error) {
			console.error("Error encountered when trying to get views. There was an error retrieving the views from the layout.", error);
		}
		return identities
	}

	componentWillLoad() {
		if(fin !== undefined) {
			this.setupContextPicker().then(_ => {});
		} else {
			addEventListener("finReady", async () => {
				if (window["fin"] !== undefined) {
					fin = window["fin"];
					this.setupContextPicker().then(_ => {});
				}
			});
		}

	}

	render() {
		if (this.showContextGroupList) {
			return (
				<div id="available-context" onMouseLeave={this.hideContextList.bind(this)}>
					{' '}
					{this.availableContextGroups.map(availableContextGroup => (
						<span
							title={this.getContextGroupTooltip(availableContextGroup.id)}
							class="fade-in"
							style={{
								padding: '0px 5px',
								color: availableContextGroup.color,
								cursor: 'pointer',
							}}
							onClick={() => this.updateContextGroup(availableContextGroup.id)}
						>
							&#11044;
						</span>
					))}
				</div>
			);
		} else if (this.contextGroupId === undefined) {
			return (
				<div>
					{this.showListOnClick ? (
						<span
							onClick={this.showContextList.bind(this)}
							title={this.unselectedText}
							style={{ padding: '0px 5px', color: `${this.unselectedColor}`, position: 'relative', display: 'inline-block' }}
						>
							&#11044;
							<span
							style={{
								content: '""',
								position: 'absolute',
								width: '2px',
								height: '87%',
								backgroundColor: `${this.unselectedLineColor}`,
								top: '-2px',
								left: '27%',
								transform: 'rotate(45deg)',
								transformOrigin: 'left bottom'
							}}
						></span>
						</span>
					) : (
						<span
							onMouseEnter={this.showContextList.bind(this)}
							title={this.unselectedText}
							style={{ padding: '0px 5px', color: `${this.unselectedColor}`, position: 'relative', display: 'inline-block' }}
						>
							&#11044;
							<span
							style={{
								content: '""',
								position: 'absolute',
								width: '2px',
								height: '87%',
								backgroundColor: `${this.unselectedLineColor}`,
								top: '-2px',
								left: '27%',
								transform: 'rotate(45deg)',
								transformOrigin: 'left bottom'
							}}
						></span>
						</span>
					)}
				</div>
			);
		} else {
			return (
				<div id="selected-context">
					{this.showListOnClick ? (
						<span
							onClick={this.showContextList.bind(this)}
							title={this.getContextGroupTooltip(this.contextGroupId, true)}
							style={{ padding: '0px 5px', color: `${this.iconColor}` }}
						>
							&#11044;
						</span>
					) : (
						<span
							onMouseEnter={this.showContextList.bind(this)}
							title={this.getContextGroupTooltip(this.contextGroupId, true)}
							style={{ padding: '0px 5px', color: `${this.iconColor}` }}
						>
							&#11044;
						</span>
					)}
				</div>
			);
		}
	}
}
